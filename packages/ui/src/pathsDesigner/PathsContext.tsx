import { createActorContext } from "@xstate/react";
import { PathsFilterMachine } from "../utils/PathsFilterMachine.tsx";

export const PathsContext = createActorContext(PathsFilterMachine);