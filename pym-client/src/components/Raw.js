import { useParams } from "react-router-dom";

const Raw = () => {
  const { id } = useParams();
  return (
    < img
      src={"https://pym.jchun.me/api/image/" + id}
      alt={"Not loading properly!"}
    />
  )
}

export default Raw;