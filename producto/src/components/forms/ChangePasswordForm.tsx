import {useReducer} from 'react'
import { supabase } from '../../lib/supabaseClient'
import styles from './LoginForm.module.css'
import { Button, TextField, Typography, Box } from "../ui";

export const ChangePasswordForm = () => {
    const [state, dispatch] = useReducer(passwordFormReducer, initialState)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.currentTarget
        dispatch({ type: 'CHANGE', payload: {field: name, value}})
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name } = e.currentTarget 
        dispatch({ type: 'BLUR', payload: {field: name}})
    }

    const handleSubmit = async(e: any) => {
        e.preventDefault()

        const currentPasswordError = validateCurrentPassword(state.values.currentPassword)
        const newPasswordError = validateNewPassword(state.values.newPassword, state.values.currentPassword)
        const confirmPassword = validateConfirmPassword(state.values.confirmPassword, state.values.newPassword)


        if(currentPasswordError || newPasswordError || confirmPassword) {
            dispatch({
                type: 'SUBMIT_ERROR',
                payload: 'Please fix errors above'
            })
            return;
        }

        dispatch({ type: 'SUBMIT_START'})

        try {
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: (await supabase.auth.getUser()).data.user?.email || '',
                password: state.values.currentPassword,
            })

            if(signInError) {
                dispatch({
                    type: 'SUBMIT_ERROR',
                    payload: 'Current password is incorrect'
                })
                return
            }

            const { error: updateError } = await supabase.auth.updateUser({
                password: state.values.newPassword,
            })
            if(updateError) {
                dispatch({
                    type: 'SUBMIT_ERROR',
                    payload: updateError.message || 'Faiiled to update password',
                })
                return
            }

            dispatch({
                type: 'SUBMIT_SUCCESS',
                payload: 'Password changed successfully!'
            })

            setTimeout(() => {
                dispatch({type: 'RESET'})
            }, 3000)
        } catch(error) {
            dispatch({
                type: 'SUBMIT_ERROR',
                payload: 'An unexpected error occurred'
            })
        }
    }

    return(
            <form onSubmit={handleSubmit} className={styles.form}>
                <Box className={styles.formGroup} style={{ marginBottom: 16 }}>
                    <TextField
                        label="Current Password"
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        value={state.values.currentPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={!!(state.touched.currentPassword && state.errors.currentPassword)}
                        helperText={state.touched.currentPassword && state.errors.currentPassword ? state.errors.currentPassword : undefined}
                        disabled={state.status === 'submitting'}
                    />
                </Box>

                <Box className={styles.formGroup} style={{ marginBottom: 16 }}>
                    <TextField
                        label="New Password"
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={state.values.newPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={!!(state.touched.newPassword && state.errors.newPassword)}
                        helperText={state.touched.newPassword && state.errors.newPassword ? state.errors.newPassword : undefined}
                        disabled={state.status === 'submitting'}
                    />
                </Box>

                <Box className={styles.formGroup} style={{ marginBottom: 16 }}>
                    <TextField
                        label="Confirm Password"
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={state.values.confirmPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={!!(state.touched.confirmPassword && state.errors.confirmPassword)}
                        helperText={state.touched.confirmPassword && state.errors.confirmPassword ? state.errors.confirmPassword : undefined}
                        disabled={state.status === 'submitting'}
                    />
                </Box>

                <Button type="submit" disabled={state.status === 'submitting'}>
            {state.status === 'submitting' ? 'Changing...' : 'Change Password'}
        </Button>

        {state.statusMessage && (
            <Typography color={state.status === 'error' ? 'error' : 'success'} style={{ marginTop: 16 }}>
                {state.statusMessage}
            </Typography>
        )}


            </form>

        )
}

type PasswordFormState = {
    values: {
        currentPassword: string;
        newPassword: string;
        confirmPassword: string;
    }
    touched: {
        currentPassword?: boolean;
        newPassword?: boolean;
        confirmPassword?: boolean;

    }
    errors: {
        currentPassword?: string;
        newPassword?: string;
        confirmPassword?: string;
    }
    status: 'idle' | 'submitting' | 'success' | 'error';
    statusMessage?: string | undefined;
}

type PasswordFormAction = 
| { type: 'CHANGE'; payload: { field: string; value: string}}
| { type: 'BLUR'; payload: { field: string}}
| { type: 'SUBMIT_START'}
| { type: 'SUBMIT_SUCCESS'; payload: string }
| { type: 'SUBMIT_ERROR'; payload: string }
| { type: 'RESET'}

const initialState: PasswordFormState = {
    values: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    },
    touched: {},
    errors: {
        currentPassword: undefined,
        newPassword: undefined,
        confirmPassword: undefined,
    },
    status: 'idle',
}

const validateCurrentPassword = (value: string):string | undefined => {
    if(!value) return 'Current password is required';
    return undefined
}

const validateNewPassword = (value:string, currentPassword:string):string | undefined => {
    if(!value) return 'New password is required'
    if(value.length < 8) return 'Password must be at least 8 characters'
    if(value === currentPassword) return 'New password cannot be same as old password'
    return undefined
}

const validateConfirmPassword = (value: string, newPassword: string): string | undefined => {
    if(!value) return 'Please confirm your password'
    if(value !== newPassword) return 'Passwords does not match'
    return undefined
}

const passwordFormReducer = (state: PasswordFormState, action: PasswordFormAction): PasswordFormState => {
    switch(action.type) {
        case 'CHANGE': {
            const { field, value} = action.payload;
            return {
                ...state,
                values: {
                    ...state.values,
                    [field]: value,
                },
                errors: {
                    ...state.errors,
                    [field]: undefined,
                }
            }
        }
        case 'BLUR': {
            const { field } = action.payload;
            const value = state.values[field as keyof typeof state.values]
            let error: string | undefined;

            if(field === 'currentPassword') {
                error = validateCurrentPassword(value)
            } else if(field === 'newPassword') {
                error = validateNewPassword(value, state.values.currentPassword)
            } else if(field === 'confirmPassword') {
                error = validateConfirmPassword(value, state.values.newPassword)
            }

            return {
                ...state,
                touched: {...state.touched, [field]: true},
                errors: {...state.errors, [field]: error},
            }
        }

        case 'SUBMIT_START': 
            return { ...state, status: 'submitting', statusMessage: undefined}
        
        case 'SUBMIT_SUCCESS': 
        return {
            ...state,
            status: 'success',
            statusMessage: action.payload,
            values: initialState.values,
        }
        case 'SUBMIT_ERROR':
            return {
                ...state,
                status: 'error',
                statusMessage: action.payload,
            }
        case 'RESET':
            return initialState;

        default: return state;
    }
}

