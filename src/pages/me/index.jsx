import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

function index() {
  const { replace } = useRouter();

  useEffect(() => {
    replace("/me/overview");
  }, []);
  return <div>index</div>;
}

export default index;
