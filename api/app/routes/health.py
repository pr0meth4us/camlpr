import os
import psutil
import torch

from flask import Blueprint, jsonify

bp = Blueprint("health", __name__)


def _mem_mb():
    proc = psutil.Process(os.getpid())
    return proc.memory_info().rss / (1024 ** 2)


@bp.route("/health")
def health():
    return jsonify(status="healthy"), 200


@bp.route("/memory")
def memory():
    sys_mb = round(_mem_mb(), 2)
    torch_mb = round(torch.cuda.memory_allocated() / (1024 ** 2), 2) if torch.cuda.is_available() else 0.0
    return jsonify(system_memory_mb=sys_mb, torch_memory_mb=torch_mb), 200
