import type { ReactNode } from "react";

type PrivateRoutesProps = {
  children: ReactNode;
}


export default function PrivateRoute({children}: PrivateRoutesProps) {
  return children;
}