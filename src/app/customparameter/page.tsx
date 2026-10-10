import React from "react";
import UserList from "./_components/UserList";
import DraggableTable from "./_components/DraggableTable";

const userUrl = "http://localhost:3000/api/users";

const App: React.FC = () => {
  return (
    <div>
      <DraggableTable userUrl={userUrl} />
      <h2>user lIst</h2>
      <UserList />
    </div>
  );
};

export default App;
