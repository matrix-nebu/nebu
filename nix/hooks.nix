{
  pkgs,
  system,
  nixhooks,
  ...
}:
let
  inherit (nixhooks.lib.${system}) presets mkHooks;
  inherit (pkgs) lib;

  scripts = import ./scripts { inherit pkgs; };
in
mkHooks {
  hooks = {
    nixfmt = {
      entry = lib.getExe pkgs.nixfmt;
      args = [ "--check" ];
      files = "\\.nix$";
      serial = false;
    };

    prettier = presets.prettier {
      entry = lib.getExe pkgs.prettier;
    };

    signoff = {
      script = builtins.readFile ./scripts/check-signoff.sh;
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
