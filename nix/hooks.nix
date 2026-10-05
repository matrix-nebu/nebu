{
  pkgs,
  system,
  nixhooks,
  ...
}:
let
  inherit (nixhooks.lib.${system}) presets mkHooks;
in
mkHooks {
  hooks = {
    nixfmt = {
      entry = "${pkgs.nixfmt}/bin/nixfmt";
      args = [ "--check" ];
      files = "\\.nix$";
      serial = false;
    };

    prettier = presets.prettier {
      entry = "${pkgs.prettier}/bin/prettier";
    };
  };

  settings.githubActions = {
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
}
