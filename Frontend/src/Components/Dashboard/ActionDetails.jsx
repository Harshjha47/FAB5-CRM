import { useCustomer } from "../../Context/CustomerContext";
import { Link, useParams } from "react-router-dom";
import { MdArrowOutward } from "react-icons/md";

function ActionDetails({ logInfo }) {
  const { id } = useParams();
  return (
    <>
      <section className="flex flex-col justify-start p-2 w-full  divide-y ">
        <Link
          to={`/customer/${id}/conection/${logInfo}/history`}
          className="flex justify-between items-center w-full py-2"
        >
          Order Profile
          <MdArrowOutward/>
        </Link>
        <Link
          to={`/customer/${id}/conection/${logInfo}/manage`}
          className="flex justify-between items-center w-full py-2"
        >
          Manage Order
          <MdArrowOutward/>

        </Link>
      </section>
    </>
  );
}

export default ActionDetails;
