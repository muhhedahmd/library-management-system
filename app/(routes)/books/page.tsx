
import { FilterBar } from "../../_components/filter-bar";
import BookGrid from "./book-grid";




export default function Home() {
  return (
    <div className=" w-full px-4 py-6">

      <FilterBar className="my-6" />

      <BookGrid />
    </div>
  )
}


