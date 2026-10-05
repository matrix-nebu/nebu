{
  description = "nebu";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

    nixhooks = {
      url = "git+https://tangled.org/poacher.dev/nixhooks";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs =
    inputs@{
      self,
      nixpkgs,
      nixhooks,
    }:
    let
      inherit (import ./nix/lib.nix inputs) forAllSystems;
    in
    {
      devShells = forAllSystems (args: import ./nix/devshell.nix (inputs // args));

      packages = forAllSystems (args: (import ./nix/hooks.nix (inputs // args)).packages);
      apps = forAllSystems (args: (import ./nix/hooks.nix (inputs // args)).apps);
    };
}
