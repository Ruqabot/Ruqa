import { type ActionRowComponents, Constants } from "eris";
import { env } from "node:process";
import ruqa from "..";

export const trackStartButtons: ActionRowComponents[] = [
    {
        type: Constants.ComponentTypes.BUTTON,
        style: Constants.ButtonStyles.SECONDARY,
        custom_id: "pauseOrResume",
        label: "Pause",
        disabled: false,
    },
    {
        type: Constants.ComponentTypes.BUTTON,
        style: Constants.ButtonStyles.SECONDARY,
        custom_id: "skip",
        label: "Skip",
        disabled: false,
    },
    {
        type: Constants.ComponentTypes.BUTTON,
        style: Constants.ButtonStyles.DANGER,
        custom_id: "stop",
        label: "Stop",
        disabled: false,
    },
];

export const trackStartModifier: ActionRowComponents[] = [
    {
        type: Constants.ComponentTypes.BUTTON,
        style: Constants.ButtonStyles.SECONDARY,
        custom_id: "pauseOrResume",
        label: "Resume",
        disabled: false,
    },
    {
        type: Constants.ComponentTypes.BUTTON,
        style: Constants.ButtonStyles.SECONDARY,
        custom_id: "skip",
        label: "Skip",
        disabled: true,
    },
    {
        type: Constants.ComponentTypes.BUTTON,
        style: Constants.ButtonStyles.DANGER,
        custom_id: "stop",
        label: "Stop",
        disabled: false,
    },
];

export const nowplayingButtons: ActionRowComponents[] = [
    {
        type: Constants.ComponentTypes.BUTTON,
        style: Constants.ButtonStyles.SECONDARY,
        custom_id: "np_pauseOrResume",
        label: "Pause",
        disabled: false,
    },
    {
        type: Constants.ComponentTypes.BUTTON,
        style: Constants.ButtonStyles.SECONDARY,
        custom_id: "np_skip",
        label: "Skip",
        disabled: false,
    },
    {
        type: Constants.ComponentTypes.BUTTON,
        style: Constants.ButtonStyles.SECONDARY,
        custom_id: "np_refresh",
        label: "Refresh",
        disabled: false,
    },
    {
        type: Constants.ComponentTypes.BUTTON,
        style: Constants.ButtonStyles.DANGER,
        custom_id: "np_stop",
        label: "Stop",
        disabled: false,
    },
    {
        type: Constants.ComponentTypes.BUTTON,
        style: Constants.ButtonStyles.DANGER,
        custom_id: "np_delete",
        label: "Delete",
        disabled: false,
    },
];

export const nowplayingModifier: ActionRowComponents[] = [
    {
        type: Constants.ComponentTypes.BUTTON,
        style: Constants.ButtonStyles.SECONDARY,
        custom_id: "np_pauseOrResume",
        label: "Resume",
        disabled: false,
    },
    {
        type: Constants.ComponentTypes.BUTTON,
        style: Constants.ButtonStyles.SECONDARY,
        custom_id: "np_skip",
        label: "Skip",
        disabled: true,
    },
    {
        type: Constants.ComponentTypes.BUTTON,
        style: Constants.ButtonStyles.SECONDARY,
        custom_id: "np_refresh",
        label: "Refresh",
        disabled: false,
    },
    {
        type: Constants.ComponentTypes.BUTTON,
        style: Constants.ButtonStyles.DANGER,
        custom_id: "np_stop",
        label: "Stop",
        disabled: false,
    },
    {
        type: Constants.ComponentTypes.BUTTON,
        style: Constants.ButtonStyles.DANGER,
        custom_id: "np_delete",
        label: "Delete",
        disabled: false,
    },
];

export const queueActiveButtons: ActionRowComponents[] = [
    {
        type: Constants.ComponentTypes.BUTTON,
        style: Constants.ButtonStyles.PRIMARY,
        custom_id: "q_previousStart",
        label: "First",
        disabled: false,
    },
    {
        type: Constants.ComponentTypes.BUTTON,
        style: Constants.ButtonStyles.PRIMARY,
        custom_id: "q_previous",
        label: "Back",
        disabled: false,
    },
    {
        type: Constants.ComponentTypes.BUTTON,
        style: Constants.ButtonStyles.PRIMARY,
        custom_id: "q_forward",
        label: "Forward",
        disabled: false,
    },
    {
        type: Constants.ComponentTypes.BUTTON,
        style: Constants.ButtonStyles.PRIMARY,
        custom_id: "q_forwardEnd",
        label: "Last",
        disabled: false,
    },
    {
        type: Constants.ComponentTypes.BUTTON,
        style: Constants.ButtonStyles.DANGER,
        custom_id: "q_delete",
        label: "Delete",
        disabled: false,
    },
];

export const queueDisabledButtons: ActionRowComponents[] = [
    {
        type: Constants.ComponentTypes.BUTTON,
        style: Constants.ButtonStyles.PRIMARY,
        custom_id: "q_previousStart",
        label: "First",
        disabled: true,
    },
    {
        type: Constants.ComponentTypes.BUTTON,
        style: Constants.ButtonStyles.PRIMARY,
        custom_id: "q_previous",
        label: "Back",
        disabled: true,
    },
    {
        type: Constants.ComponentTypes.BUTTON,
        style: Constants.ButtonStyles.PRIMARY,
        custom_id: "q_forward",
        label: "Forward",
        disabled: true,
    },
    {
        type: Constants.ComponentTypes.BUTTON,
        style: Constants.ButtonStyles.PRIMARY,
        custom_id: "q_forwardEnd",
        label: "Last",
        disabled: true,
    },
    {
        type: Constants.ComponentTypes.BUTTON,
        style: Constants.ButtonStyles.DANGER,
        custom_id: "q_delete",
        label: "Delete",
        disabled: true,
    },
];

export const helpCommandLinks: ActionRowComponents[] = [
    {
        type: Constants.ComponentTypes.BUTTON,
        style: Constants.ButtonStyles.LINK,
        label: "Invite me!",
        url: `https://discord.com/api/oauth2/authorize?client_id=${ruqa?.user?.id}&permissions=${env.INVITE_PERMISSIONS ?? 0}&scope=bot`,
    },
    {
        type: Constants.ComponentTypes.BUTTON,
        style: Constants.ButtonStyles.LINK,
        label: "Support Server",
        url: `https://discord.gg/${env.SUPPORT_SERVER ?? "not_set"}`,
    },
    {
        type: Constants.ComponentTypes.BUTTON,
        style: Constants.ButtonStyles.LINK,
        label: "Friends Server",
        url: `https://discord.gg/${env.FRIENDS_SERVER ?? "not_set"}`,
    },
];
