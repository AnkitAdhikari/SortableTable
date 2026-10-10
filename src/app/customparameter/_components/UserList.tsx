import { prisma } from "@/lib/prisma";

async function UserList() {
  // Bad implementation
  /**
   *  const res = await fetch("http://localhost:3000/api/users");
   *  const data = await res.json();
   *  const users = data?.data || [];
   */

  // Good implementation
  // inferes the type of the users from the prisma schema
  const users = await prisma.user.findMany();

  return (
    <div>
      {users.map((user) => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}

export default UserList;
