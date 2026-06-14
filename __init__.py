"""
Comfyui_NanGuangAI_Text_Encryption
南光AI文本加密插件
作者：南光AIGC
版本：1.0.0
"""

import os
import sys

# 注册节点
NODE_CLASS_MAPPINGS = {}
NODE_DISPLAY_NAME_MAPPINGS = {}

# 导入节点模块
from .nodes.text_encryption import NanGuangAI_TextEncryption

NODE_CLASS_MAPPINGS["NanGuangAI_TextEncryption"] = NanGuangAI_TextEncryption
NODE_DISPLAY_NAME_MAPPINGS["NanGuangAI_TextEncryption"] = "南光AI文本加密"

WEB_DIRECTORY = "./js"

__all__ = ["NODE_CLASS_MAPPINGS", "NODE_DISPLAY_NAME_MAPPINGS", "WEB_DIRECTORY"]
