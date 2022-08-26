import * as Fathom from "fathom-client";
import { useEffect } from "react";

const BlockTrackingForMe = () => {
  useEffect(() => {
    Fathom.blockTrackingForMe();
  }, []);
  return null;
};

export default BlockTrackingForMe;
