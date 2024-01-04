import { useParams } from "react-router-dom";
import FormUserVerify from "../../Components/FormUserVerify";
import PageLanding from "../../Utils/PageLanding";

const UserVerify = () => {
    const { id } = useParams();

    return (
        <PageLanding>
            <FormUserVerify user={id} />
        </PageLanding>
    );
}

export default UserVerify;