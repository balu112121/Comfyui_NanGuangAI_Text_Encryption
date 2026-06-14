import { app } from "../../scripts/app.js";

/**
 * 南光AI文本加密插件 - 前端交互
 * 版本：1.3.0
 * 作者：南光AIGC
 */

const PASSWORD = "TUIN666";
const NODE_CLASS = "NanGuangAI_TextEncryption";
const NODE_DISPLAY_NAME = "南光AI文本加密";

// 存储每个节点的加密状态
const nodeEncryptionStates = new Map();

// 辅助函数：密码输入对话框
async function showPasswordDialog() {
    if (app.extensionManager?.dialog?.prompt) {
        try {
            return await app.extensionManager.dialog.prompt({
                title: "南光AI文本加密 - 输入密码",
                message: "请输入解锁密码以查看加密内容：",
                defaultValue: ""
            });
        } catch (e) {
            return prompt("南光AI文本加密\n请输入解锁密码以查看加密内容：");
        }
    }
    return prompt("南光AI文本加密\n请输入解锁密码以查看加密内容：");
}

// 辅助函数：提示对话框
async function showAlertDialog(title, message) {
    if (app.extensionManager?.dialog?.alert) {
        try {
            await app.extensionManager.dialog.alert({ title, message });
        } catch (e) {
            alert(title + "\n" + message);
        }
    } else {
        alert(title + "\n" + message);
    }
}

app.registerExtension({
    name: "Comfyui.NanGuangAI.TextEncryption",

    async beforeRegisterNodeDef(nodeType, nodeData, app) {
        if (nodeData.name !== NODE_CLASS) return;

        // ===== 保存原始 onNodeCreated =====
        const origOnCreated = nodeType.prototype.onNodeCreated;

        nodeType.prototype.onNodeCreated = function() {
            origOnCreated?.apply(this, arguments);

            const self = this;
            const nodeId = self.id;

            // 初始化状态
            if (!nodeEncryptionStates.has(nodeId)) {
                nodeEncryptionStates.set(nodeId, {
                    isLocked: false,
                    originalText: ""
                });
            }
            const state = nodeEncryptionStates.get(nodeId);

            // 延迟初始化（确保widgets已创建）
            setTimeout(() => {
                const textWidget = self.widgets.find(w => w.name === "text");
                const encryptWidget = self.widgets.find(w => w.name === "encrypt");

                if (!textWidget || !encryptWidget) return;

                // 保存引用
                self._ngTextWidget = textWidget;
                self._ngEncryptWidget = encryptWidget;
                self._ngState = state;

                // 保存原始文本
                state.originalText = textWidget.value || "";

                // ===== 创建DOM覆盖层（遮挡文本框）=====
                const inputEl = textWidget.inputEl;
                let overlay = null;

                if (inputEl && inputEl.parentElement) {
                    const container = inputEl.parentElement;
                    container.style.position = "relative";

                    overlay = document.createElement("div");
                    overlay.innerHTML = `
                        <div style="text-align:center;pointer-events:none;user-select:none;">
                            <div style="font-size:26px;margin-bottom:6px;">🔒</div>
                            <div style="font-size:13px;font-weight:bold;color:#ffaa44;letter-spacing:1px;">文本已加密</div>
                            <div style="font-size:10px;color:#777;margin-top:4px;">右键解锁</div>
                        </div>
                    `;
                    overlay.style.cssText = `
                        position: absolute;
                        top: 0; left: 0; right: 0; bottom: 0;
                        background: rgba(20, 20, 35, 0.94);
                        display: none;
                        align-items: center;
                        justify-content: center;
                        border-radius: 3px;
                        z-index: 100;
                        pointer-events: none;
                    `;
                    container.appendChild(overlay);
                }
                self._ngOverlay = overlay;

                // ===== 更新视觉状态 =====
                function updateVisual(encrypted) {
                    state.isLocked = encrypted;

                    if (encrypted) {
                        // 保存原文
                        state.originalText = textWidget.value || "";

                        // 文本框隐藏
                        if (inputEl) {
                            inputEl.style.opacity = "0";
                            inputEl.style.pointerEvents = "none";
                        }
                        // 显示覆盖层
                        if (overlay) overlay.style.display = "flex";

                        // 隐藏加密开关（设置高度为0，opacity为0）
                        encryptWidget.hidden = true;
                        if (encryptWidget.inputEl) {
                            encryptWidget.inputEl.style.display = "none";
                        }
                        // 尝试找到加密开关的DOM元素并隐藏
                        try {
                            const widgetIdx = self.widgets.indexOf(encryptWidget);
                            if (widgetIdx >= 0 && self.widgetElements && self.widgetElements[widgetIdx]) {
                                self.widgetElements[widgetIdx].style.display = "none";
                            }
                        } catch(e) {}

                    } else {
                        // 恢复文本框
                        if (inputEl) {
                            inputEl.style.opacity = "1";
                            inputEl.style.pointerEvents = "";
                        }
                        // 隐藏覆盖层
                        if (overlay) overlay.style.display = "none";

                        // 显示加密开关
                        encryptWidget.hidden = false;
                        if (encryptWidget.inputEl) {
                            encryptWidget.inputEl.style.display = "";
                        }
                        try {
                            const widgetIdx = self.widgets.indexOf(encryptWidget);
                            if (widgetIdx >= 0 && self.widgetElements && self.widgetElements[widgetIdx]) {
                                self.widgetElements[widgetIdx].style.display = "";
                            }
                        } catch(e) {}
                    }

                    self.setSize(self.computeSize());
                    self.setDirtyCanvas(true, true);
                }

                // 初始化
                updateVisual(encryptWidget.value);

                // 监听开关变化
                const origCallback = encryptWidget.callback;
                encryptWidget.callback = function(value) {
                    updateVisual(value);
                    if (origCallback) origCallback.call(this, value);
                };

                // 监听文本变化（未加密时保存原文）
                const origTextCallback = textWidget.callback;
                textWidget.callback = function(value) {
                    if (!state.isLocked) {
                        state.originalText = value;
                    }
                    if (origTextCallback) origTextCallback.call(this, value);
                };

                // 拦截输入（加密状态下阻止修改）
                if (inputEl) {
                    inputEl.addEventListener("input", function(e) {
                        if (state.isLocked) {
                            e.preventDefault();
                            e.stopPropagation();
                            textWidget.value = state.originalText;
                            inputEl.value = state.originalText;
                            return false;
                        }
                    }, true);
                }

                self._ngUpdateVisual = updateVisual;

            }, 150);
        };

        // ===== 右键菜单注入（参考用户代码的方式）=====
        const origGetExtraMenuOptions = nodeType.prototype.getExtraMenuOptions;
        nodeType.prototype.getExtraMenuOptions = function(_, options) {
            const self = this;
            const state = self._ngState;

            // 只有在加密锁定状态下才显示解锁菜单
            if (state && state.isLocked) {
                options.unshift({
                    content: "🔓 " + NODE_DISPLAY_NAME + "（解锁）",
                    callback: async () => {
                        const pwd = await showPasswordDialog();

                        if (pwd === null || pwd === undefined) {
                            return; // 用户取消
                        }

                        if (pwd === PASSWORD) {
                            // 密码正确：关闭加密，恢复原文
                            if (self._ngEncryptWidget) {
                                self._ngEncryptWidget.value = false;
                                if (self._ngEncryptWidget.callback) {
                                    self._ngEncryptWidget.callback(false);
                                }
                            }
                            if (self._ngUpdateVisual) {
                                self._ngUpdateVisual(false);
                            }
                            // 恢复原文到文本框
                            if (self._ngTextWidget) {
                                self._ngTextWidget.value = state.originalText;
                                if (self._ngTextWidget.inputEl) {
                                    self._ngTextWidget.inputEl.value = state.originalText;
                                    self._ngTextWidget.inputEl.style.opacity = "1";
                                    self._ngTextWidget.inputEl.style.pointerEvents = "";
                                    setTimeout(() => self._ngTextWidget.inputEl.focus(), 50);
                                }
                            }
                            if (self._ngOverlay) {
                                self._ngOverlay.style.display = "none";
                            }
                            state.isLocked = false;
                            self.setSize(self.computeSize());
                            self.setDirtyCanvas(true, true);

                            await showAlertDialog("解锁成功", "文本已解密，您可以查看和编辑内容。");
                        } else {
                            await showAlertDialog("密码错误", "密码输入错误，无法解锁文本内容。\n\n正确密码：TUIN666");
                        }
                    }
                });
            }

            return origGetExtraMenuOptions?.apply(this, arguments);
        };

        // ===== 自定义绘制 - 加密状态标签 =====
        const origDrawForeground = nodeType.prototype.onDrawForeground;
        nodeType.prototype.onDrawForeground = function(ctx) {
            const result = origDrawForeground?.apply(this, arguments);

            const state = nodeEncryptionStates.get(this.id);
            if (state && state.isLocked) {
                ctx.save();

                const labelText = "🔒 已加密";
                ctx.font = "bold 12px sans-serif";
                const textWidth = ctx.measureText(labelText).width;
                const padding = 8;
                const x = this.size[0] - textWidth - padding * 2 - 5;
                const y = 5;
                const height = 20;

                ctx.fillStyle = "rgba(255, 59, 48, 0.9)";
                ctx.beginPath();
                ctx.roundRect(x, y, textWidth + padding * 2, height, 4);
                ctx.fill();

                ctx.fillStyle = "#ffffff";
                ctx.textAlign = "left";
                ctx.textBaseline = "middle";
                ctx.fillText(labelText, x + padding, y + height / 2);

                ctx.restore();
            }

            return result;
        };

        // ===== 序列化时保存状态 =====
        const origSerialize = nodeType.prototype.onSerialize;
        nodeType.prototype.onSerialize = function(o) {
            origSerialize?.apply(this, arguments);
            const state = nodeEncryptionStates.get(this.id);
            if (state) {
                o.ng_enc_state = {
                    isLocked: state.isLocked,
                    originalText: state.originalText
                };
            }
        };

        // ===== 反序列化时恢复状态 =====
        const origConfigure = nodeType.prototype.onConfigure;
        nodeType.prototype.onConfigure = function(o) {
            origConfigure?.apply(this, arguments);

            if (o.ng_enc_state) {
                const state = nodeEncryptionStates.get(this.id);
                if (state) {
                    state.isLocked = o.ng_enc_state.isLocked;
                    state.originalText = o.ng_enc_state.originalText || "";

                    // 延迟恢复UI
                    setTimeout(() => {
                        if (!this.widgets) return;

                        const textWidget = this.widgets.find(w => w.name === "text");
                        const encryptWidget = this.widgets.find(w => w.name === "encrypt");

                        if (state.isLocked) {
                            // 触发加密视觉状态
                            if (encryptWidget) {
                                encryptWidget.value = true;
                            }
                            if (this._ngUpdateVisual) {
                                this._ngUpdateVisual(true);
                            }
                        }
                    }, 200);
                }
            }
        };
    },

    // 节点删除时清理状态
    nodeRemoved(node) {
        if (node.comfyClass === NODE_CLASS || node.type === NODE_CLASS) {
            nodeEncryptionStates.delete(node.id);
        }
    }
});
