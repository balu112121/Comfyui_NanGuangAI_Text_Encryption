"""
南光AI文本加密节点 - 后端实现
"""

class NanGuangAI_TextEncryption:
    """
    南光AI文本加密节点
    功能：
    1. 接收文本输入（支持widget输入和节点连接输入）
    2. 输出加密后的文本（实际输出原文，前端控制显示/隐藏）
    3. 前端通过加密开关控制文本框的显示/隐藏
    """

    CATEGORY = "南光AI/加密"
    RETURN_TYPES = ("STRING",)
    RETURN_NAMES = ("文本",)
    FUNCTION = "process_text"

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "text": ("STRING", {
                    "multiline": True,
                    "default": "",
                    "placeholder": "在此输入提示词文本...",
                }),
                "encrypt": ("BOOLEAN", {
                    "default": False,
                    "label_on": "已加密",
                    "label_off": "未加密",
                }),
            },
            "hidden": {
                "unique_id": "UNIQUE_ID",
                "extra_pnginfo": "EXTRA_PNGINFO",
            }
        }

    def process_text(self, text, encrypt, unique_id=None, extra_pnginfo=None):
        """
        处理文本，直接返回原文
        加密/解密逻辑完全由前端控制显示
        """
        # 实际返回原文，前端控制显示效果
        return (text,)
