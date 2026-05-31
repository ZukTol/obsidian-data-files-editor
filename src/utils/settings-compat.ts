import { Setting, requireApiVersion } from 'obsidian';
import * as ObsidianModule from 'obsidian';

export interface SettingsContainer {
    addSetting(cb: (setting: Setting) => void): void;
}

export function createSettingsGroup(
    containerEl: HTMLElement,
    heading?: string,
    desc?: string
): SettingsContainer {
    if (requireApiVersion('1.11.0')) {
        const SettingGroupClass = (ObsidianModule as unknown as {
            SettingGroup?: new (containerEl: HTMLElement) => {
                setHeading(heading: string): any;
                addSetting(cb: (setting: Setting) => void): void;
            }
        }).SettingGroup;

        if (SettingGroupClass) {
            const group = new SettingGroupClass(containerEl);
            if (heading) group.setHeading(heading);

            if (desc) {
                if (typeof (group as any).setDesc === 'function') {
                    (group as any).setDesc(desc);
                } else {
                    containerEl.createEl('p', { text: desc, cls: 'setting-item-description' });
                }
            }

            return {
                addSetting(cb: (setting: Setting) => void) {
                    group.addSetting(cb);
                }
            };
        }
    }

    if (heading) {
        const headingEl = containerEl.createDiv('setting-group-heading');
        headingEl.createEl('h3', { text: heading });
    }

    if (desc) {
        containerEl.createEl('p', { text: desc, cls: 'setting-item-description' });
    }

    return {
        addSetting(cb: (setting: Setting) => void) {
            const setting = new Setting(containerEl);
            cb(setting);
        }
    };
}
