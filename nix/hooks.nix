{
  pkgs,
  system,
  nixhooks,
  ...
}:
let
  inherit (nixhooks.lib.${system}) presets mkHooks;
  inherit (pkgs) lib;
in
mkHooks {
  hooks = {
    nixfmt = {
      entry = lib.getExe pkgs.nixfmt;
      args = [ "--check" ];
      files = "\\.nix$";
      serial = false;
    };

    eslint = {
      entry = lib.getExe pkgs.pnpm;
      args = [
        "run"
        "-r"
        "lint"
      ];
      files = "\\.(ts|tsx|js|mjs|cjs)$";
      serial = true;
      pass_filenames = false;
    };

    signoff = {
      script = builtins.readFile ./scripts/check-signoff.sh;
      stages = [ "commit-msg" ];
    };

    scoped = {
      script = builtins.readFile ./scripts/check-scoped.sh;
      stages = [ "commit-msg" ];
    };
  };

  settings = {
    portable = {
      enable = true;
      dir = ".hooks";
    };

    githubActions = {
      enable = true;
      attr = "run-hooks";
      flake = true;
      runsOn = "ubuntu-latest";
      cache = true;
      on = {
        push.branches = [ "main" ];
        pull_request.branches = [ "main" ];
      };
    };
  };
}
