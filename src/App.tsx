import Navbar from "./components/navbar";
import UsersDataTable from "./users-data-table";

function App() {
  return (
    <main className="flex h-screen flex-col gap-20 bg-white px-6 py-6 dark:bg-black">
      <Navbar />
      <UsersDataTable />
    </main>
  );
}

export default App;
