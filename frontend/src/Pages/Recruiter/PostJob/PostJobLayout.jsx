import { useJob } from "../../../Context/JobContext";
import PostJobHeader from "../../../Components/PostJob/Header/PostJobHeader";
import HiringModelCards from "../../../Components/PostJob/HiringModel/HiringModelCards";
import JobForm from "../../../Components/PostJob/Form/JobForm";
import PostedJobsOverview from "./Overview/PostedJobsOverview";

import "../../../Styles/sectionSurface.css";

const PostJobLayout = () => {
  const { job } = useJob();

  const isEditMode = !!job?.id;

  return (
    <>
      <section className="section-surface">
        <PostJobHeader />
        <HiringModelCards />
      </section>

      <PostedJobsOverview />

      {(job?.hiringModel || isEditMode) && <JobForm />}
    </>
  );
};

export default PostJobLayout;

