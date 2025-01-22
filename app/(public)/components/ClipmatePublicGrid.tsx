"use client";

import { IClipmateResponse } from "@/types/clipmate";
import PublicGridTemplate from "./ClipmatePublicGridTemplate";

type Props = {
  data: Array<IClipmateResponse>;
};

const ClipmatePublicGrid = ({ data }: Props) => {
  return <PublicGridTemplate data={data} />;
};

export default ClipmatePublicGrid;
