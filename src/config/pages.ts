/**
 * Page configuration — controls which version/mode is shown for each page.
 * Flip these values to switch between page states without touching the page components.
 */

export type JoinPageVersion = 'prelaunch' | 'full';

export const pagesConfig = {
  join: {
    /**
     * 'prelaunch' — shows a minimal name/phone/email form with a pre-launch message.
     * 'full'       — shows the complete application form with all fields.
     */
    version: 'prelaunch' as JoinPageVersion,
  },
} as const;
