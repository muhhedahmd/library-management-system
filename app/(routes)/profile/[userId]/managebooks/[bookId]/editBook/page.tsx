"use client"
import EditBookForm from "@/app/_components/editBook/edit-book-form";
// import EditBookForm from "@/app/_components/editBook/edit-book-form";
import { useEffect, useState } from "react";

export  default  function  EditBookPage({ params }: { params: Promise<{ bookId: string }> }) {
  const [userIdParam, setuserIdParam] = useState<string>("")
   useEffect(() => {
     (async () => {
       setuserIdParam(
         (await params).bookId
       )
     })()
   }, [params])
  return (
      <div className="container mx-auto py-8 px-4">

        <EditBookForm bookId={userIdParam} />
      </div>
  )
}
