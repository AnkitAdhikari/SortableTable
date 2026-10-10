import React from "react";
import UserList from "./_components/UserList";
import DraggableTable from "./_components/DraggableTable";

const App: React.FC = () => {
  return (
    <div>
      <DraggableTable />
      <h2>user lIst</h2>
      <UserList />
    </div>
  );
};

export default App;
