import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@nextui-org/react";

function index() {
  const { replace } = useRouter();

  useEffect(() => {
    replace("/me/overview");
  }, []);
  return (
    <div className="align-center flex min-h-[50vh] w-full justify-center">
      <Spinner />
    </div>
  );
}

export default index;
