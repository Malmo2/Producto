import RightPanel from "../panels/Rightpanel";

export default function DashboardLayout({ children }) {
    return (
        <div className="dashboardLayout">
            <section className="dashboardMain">{children}</section>
            <RightPanel />
        </div>
    );
}
