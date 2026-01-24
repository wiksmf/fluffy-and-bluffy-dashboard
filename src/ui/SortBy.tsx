import { useSearchParams } from "react-router-dom";
import Select from "./Select";

function SortBy({ options }: { options: { value: string; label: string }[] }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const sortBy = searchParams.get("sort-by") || "";

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    searchParams.set("sort-by", e.target.value);
    setSearchParams(searchParams);
  }

  return <Select options={options} value={sortBy} onChange={handleChange} />;
}

export default SortBy;
