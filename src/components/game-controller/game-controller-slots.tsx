import {
  Children,
  type HTMLAttributes,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";

/** Named slots on `<game-controller>` / `GameController`. */
export const GAME_CONTROLLER_SLOTS = {
  stage: "stage",
  ancillaries: "ancillaries",
  leftControl: "left-control",
  actions: "actions",
} as const;

export type GameControllerSlotName =
  (typeof GAME_CONTROLLER_SLOTS)[keyof typeof GAME_CONTROLLER_SLOTS];

const SLOT_NAME = Symbol.for("game-controller.slot");

export type GameControllerSlotProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
};

export type GameControllerSlotComponent = ((props: GameControllerSlotProps) => ReactElement) & {
  displayName: string;
  [SLOT_NAME]: GameControllerSlotName;
};

function createSlotComponent(
  name: GameControllerSlotName,
  displayName: string,
): GameControllerSlotComponent {
  function Slot({ children, className, ...rest }: GameControllerSlotProps) {
    return (
      <div slot={name} className={className} {...rest}>
        {children}
      </div>
    );
  }
  Slot.displayName = displayName;
  (Slot as GameControllerSlotComponent)[SLOT_NAME] = name;
  return Slot as GameControllerSlotComponent;
}

export const GameControllerStage = createSlotComponent(
  GAME_CONTROLLER_SLOTS.stage,
  "GameController.Stage",
);
export const GameControllerAncillaries = createSlotComponent(
  GAME_CONTROLLER_SLOTS.ancillaries,
  "GameController.Ancillaries",
);
export const GameControllerLeftControl = createSlotComponent(
  GAME_CONTROLLER_SLOTS.leftControl,
  "GameController.LeftControl",
);
export const GameControllerActions = createSlotComponent(
  GAME_CONTROLLER_SLOTS.actions,
  "GameController.Actions",
);

export type PartitionedGameControllerSlots = {
  stage: ReactNode[];
  ancillaries: ReactNode[];
  leftControl: ReactNode[];
  actions: ReactNode[];
};

function slotNameOf(child: ReactElement): GameControllerSlotName | undefined {
  const fromProp = (child.props as { slot?: string }).slot;
  if (
    fromProp === GAME_CONTROLLER_SLOTS.stage ||
    fromProp === GAME_CONTROLLER_SLOTS.ancillaries ||
    fromProp === GAME_CONTROLLER_SLOTS.leftControl ||
    fromProp === GAME_CONTROLLER_SLOTS.actions
  ) {
    return fromProp;
  }
  const type = child.type;
  if (typeof type === "function" && SLOT_NAME in type) {
    return (type as GameControllerSlotComponent)[SLOT_NAME];
  }
  return undefined;
}

/**
 * Routes React children into named controller regions.
 * Unnamed children fill the stage (same as `<slot name="stage">` fallback + light DOM).
 */
export function partitionGameControllerSlots(children: ReactNode): PartitionedGameControllerSlots {
  const stage: ReactNode[] = [];
  const ancillaries: ReactNode[] = [];
  const leftControl: ReactNode[] = [];
  const actions: ReactNode[] = [];
  const implicitStage: ReactNode[] = [];

  Children.forEach(children, (child) => {
    if (child == null || child === false || child === true) return;
    if (!isValidElement(child)) {
      implicitStage.push(child);
      return;
    }
    const name = slotNameOf(child);
    if (name === GAME_CONTROLLER_SLOTS.stage) stage.push(child);
    else if (name === GAME_CONTROLLER_SLOTS.ancillaries) ancillaries.push(child);
    else if (name === GAME_CONTROLLER_SLOTS.leftControl) leftControl.push(child);
    else if (name === GAME_CONTROLLER_SLOTS.actions) actions.push(child);
    else implicitStage.push(child);
  });

  return {
    stage: stage.length > 0 ? stage : implicitStage,
    ancillaries,
    leftControl,
    actions,
  };
}

export function hasAssignedSlot(nodes: ReactNode[]): boolean {
  return nodes.length > 0;
}
