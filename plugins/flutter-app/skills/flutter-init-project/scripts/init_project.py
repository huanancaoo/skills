#!/usr/bin/env python3
"""在新目录中创建固定栈 Flutter App；失败时保留生成结果用于诊断。"""

import argparse
import json
from pathlib import Path
import re
import shlex
import shutil
import subprocess
import sys
from urllib.parse import urlsplit


PLATFORMS = ("android", "ios", "web", "macos", "windows", "linux")
PACKAGES = (
    "flutter_riverpod", "go_router", "dio", "freezed_annotation",
    "json_annotation", "intl", "shared_preferences", "flutter_secure_storage",
    "flutter_localizations@{sdk: flutter}",
    "badges", "gap", "cached_network_image", "adaptive_theme", "shimmer", "material_ui",
)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--directory", required=True, type=Path,
                        help="尚不存在的项目目录；不会覆盖已有路径")
    parser.add_argument("--name", required=True, help="Dart snake_case 项目名")
    parser.add_argument("--org", required=True, help="反向域名组织标识，如 cn.company")
    parser.add_argument("--sdk-version", required=True, help="确定的 Flutter 版本，如 3.47.0")
    parser.add_argument("--platforms", required=True, nargs="+", choices=PLATFORMS)
    parser.add_argument("--api-base-url", required=True, help="已确认的 HTTP(S) API 基础地址")
    args = parser.parse_args()
    if not re.fullmatch(r"[a-z][a-z0-9]*(?:_[a-z0-9]+)*", args.name):
        parser.error("--name 必须是以小写字母开头的 snake_case 名称")
    if not re.fullmatch(r"[a-z][a-z0-9]*(?:\.[a-z][a-z0-9]*)+", args.org):
        parser.error("--org 必须是至少两段的反向域名组织标识")
    if not re.fullmatch(r"\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?", args.sdk_version):
        parser.error("--sdk-version 必须给出确定版本，不能使用 stable、beta 或 latest")
    try:
        url = urlsplit(args.api_base_url)
        # urlsplit 仅分解地址；访问 port 才验证端口格式和范围，必须早于创建目录。
        url.port
    except ValueError as error:
        parser.error(f"--api-base-url 不是有效地址：{error}")
    if (url.scheme not in ("http", "https") or not url.hostname
            or url.username or url.password or url.query or url.fragment):
        parser.error("--api-base-url 必须是无凭据、查询参数和片段的 HTTP(S) 基础地址")
    if len(set(args.platforms)) != len(args.platforms):
        parser.error("--platforms 不得重复")
    args.directory = args.directory.expanduser().absolute()
    if args.directory.exists() or args.directory.is_symlink():
        parser.error(f"项目路径已存在，停止以保护原内容：{args.directory}")
    if not args.directory.parent.is_dir():
        parser.error("项目目录的父目录必须已经存在")
    return args


def run(command: list[str], directory: Path) -> None:
    print(f"\n$ {shlex.join(command)}", flush=True)
    subprocess.run(command, cwd=directory, check=True)


def install_template(directory: Path, project_name: str, api_base_url: str) -> None:
    template = Path(__file__).resolve().parent.parent / "assets" / "template"
    for source in sorted(template.rglob("*")):
        if source.is_file():
            target = directory / source.relative_to(template)
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_text(
                source.read_text(encoding="utf-8").replace("__PROJECT_NAME__", project_name),
                encoding="utf-8",
            )
    config = directory / "config" / "development.json"
    config.parent.mkdir()
    config.write_text(json.dumps({"API_BASE_URL": api_base_url}, indent=2) + "\n", encoding="utf-8")
    pubspec = directory / "pubspec.yaml"
    content = pubspec.read_text(encoding="utf-8")
    # SDK 创建器负责平台工程与 SDK 约束；模板只打开本地化代码生成。
    if content.count("\nflutter:\n") != 1:
        raise ValueError("Flutter 创建器生成的 pubspec.yaml 缺少唯一的顶层 flutter 配置")
    pubspec.write_text(content.replace("\nflutter:\n", "\nflutter:\n  generate: true\n"), encoding="utf-8")
    gitignore = directory / ".gitignore"
    with gitignore.open("a", encoding="utf-8") as handle:
        handle.write("\n# 项目提交 .fvmrc 锁定 SDK；本机 SDK 链接不进入版本库。\n.fvm/\n")


def main() -> int:
    args = parse_args()
    fvm = shutil.which("fvm")
    if fvm is None:
        print("缺少 fvm：请先安装 FVM 并确保它位于 PATH。", file=sys.stderr)
        return 1
    args.directory.mkdir()
    try:
        run([fvm, "use", args.sdk_version, "--force", "--skip-pub-get"], args.directory)
        run([fvm, "flutter", "create", "--template", "app", "--project-name", args.name,
             "--org", args.org, "--platforms", ",".join(args.platforms), "--no-pub", "."], args.directory)
        run([fvm, "flutter", "pub", "add", *PACKAGES], args.directory)
        run([fvm, "flutter", "pub", "add", "dev:build_runner", "dev:freezed", "dev:json_serializable",
             "dev:shared_preferences_platform_interface"],
            args.directory)
        install_template(args.directory, args.name, args.api_base_url)
        run([fvm, "flutter", "gen-l10n"], args.directory)
        run([fvm, "dart", "run", "build_runner", "build"], args.directory)
        run([fvm, "dart", "format", "lib", "test"], args.directory)
        run([fvm, "flutter", "analyze"], args.directory)
        run([fvm, "flutter", "test"], args.directory)
    except (subprocess.CalledProcessError, OSError, ValueError) as error:
        print(f"\n初始化失败：{error}\n现场已保留：{args.directory}", file=sys.stderr)
        return 1
    print(f"\n初始化与生成、分析、单元及 widget 测试完成：{args.directory}")
    print("尚未在目标设备启动或验证真实 API/平台存储。见生成项目 README.md。")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
