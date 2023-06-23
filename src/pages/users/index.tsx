import React from "react";
import { api } from "~/utils/api";

function UsersView() {
  const users = api.users.getAll.useQuery();
  console.log(users);
  return <div>page</div>;
}

export default UsersView;
