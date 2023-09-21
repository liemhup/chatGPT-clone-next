import SideBar from "../component/SideBar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <div className="w-64 border-r flex-grow-0">
        <SideBar></SideBar>
      </div>
      <div className="flex flex-col flex-grow bg-chat-100 relative h-screen overflow-y-hidden">
        {children}
      </div>
    </div>
  );
}
