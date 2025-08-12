import { Assets, Texture } from "pixi.js";

type ImagePaths = { [P: string]: string };

export type TextureManager = {
  load: (name: string, path: string) => Promise<Texture>;
  unload: (name: string) => void;
  unloadAll: () => void;

  getTexture: (name: string) => Texture;

  listAll: () => string[];
};

/** texture management. Should be a part of environment */
export async function useTextures(paths: ImagePaths): Promise<TextureManager> {
  const items = Object.entries(paths);

  const textures = new Map<string, Texture>();

  const getTexture = (name: string): Texture => {
    if (!textures.has(name)) throw new Error(`no texture with name ${name}`);
    return textures.get(name)!;
  };

  const load = async (name: string, path: string) => {
    const texture = await Assets.load(path);
    textures.set(name, texture);

    return texture;
  };

  const unload = (name: string) => {
    if (!textures.has(name)) throw new Error(`no texture with name ${name}`);

    const texture = textures.get(name)!;
    textures.delete(name);
    texture.source.unload();
  };

  const unloadAll = () => {
    for (const key of textures.keys()) unload(key);
  };

  for (const props of items) {
    await load(...props);
  }

  return {
    load,
    unload,
    unloadAll,

    getTexture,

    listAll: () => Array.from(textures.keys()),
  };
}
