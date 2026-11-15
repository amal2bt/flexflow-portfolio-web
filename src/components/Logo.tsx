import { navigateTo } from "@/lib/navigation";

export default function Logo() {
  return <div className="supplied-logo" onClick={() => navigateTo("/")}/>;
}
