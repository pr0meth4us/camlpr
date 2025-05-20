import os
import psutil
import torch

from flask import Blueprint, current_app, jsonify

bp = Blueprint("health", __name__)


def _mem_mb():
    proc = psutil.Process(os.getpid())
    return proc.memory_info().rss / (1024 ** 2)


@bp.route("/health")
def health():
    return jsonify(status="healthy", memory_mb=round(_mem_mb(), 2)), 200


@bp.route("/memory")
def memory():
    torch_mem = torch.cuda.memory_allocated() / 1024 ** 2 if torch.cuda.is_available() else 0
    return jsonify(system_memory_mb=round(_mem_mb(), 2),
                   torch_memory_mb=round(torch_mem, 2),
                   request_count=current_app.request_count)
