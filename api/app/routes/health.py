from flask import Blueprint, jsonify

bp = Blueprint("health", __name__)

@bp.route("/memory")
def memory():
    """
    Return memory usage information
    """
    import os
    import psutil
    import torch

    proc = psutil.Process(os.getpid())
    sys_mb = round(proc.memory_info().rss / (1024 ** 2), 2)

    # Only check torch memory if available
    torch_mb = 0.0
    if torch.cuda.is_available():
        torch_mb = round(torch.cuda.memory_allocated() / (1024 ** 2), 2)

    return jsonify(
        system_memory_mb=sys_mb,
        torch_memory_mb=torch_mb
    )