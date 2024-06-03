"use client";

import { useState } from "react";

export default function Counter({ users }) {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="bg-red-50">
        {users?.map((user) => {
          return <li key={user.name}>{user.name}</li>;
        }) || ""}
      </div>
      <div>Current Count: {count}</div>
      <button onClick={() => setCount((c) => (c += 1))}>+</button>
      <button onClick={() => setCount((c) => (c -= 1))}>-</button>
    </>
  );
}
