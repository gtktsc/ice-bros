import type { NextPage } from "next";
import Client from "../components/client";
import "reset-css";

import Midi from "../components/midi";

const Home: NextPage = () => {
  return (
    <Client>
      <Midi />
    </Client>
  );
};

export default Home;
