import { RootClientPage } from "./RootClientPage";
import { DAO_VERSES } from "../lib/daoText";

export default function RootPage() {
  return <RootClientPage verses={DAO_VERSES} />;
}
