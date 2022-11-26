import type { NextPage } from "next";
import dynamic from "next/dynamic";
import { Wrapper } from "./styled";

const LoadedCanvas = dynamic(() => import("../canvas"), {
  ssr: false,
});

const Midi: NextPage = () => {
  return (
    <Wrapper>
      <LoadedCanvas />
    </Wrapper>
  );
};

export default Midi;
