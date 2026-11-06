"""
Run inside Blender (Scripting workspace) when MCP is offline:
  blender --background --python create_amil_avatar.py

Creates a stylized clay teenager bust with separate pupils for export.
"""

import bpy
from mathutils import Vector
from pathlib import Path


def clear_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for block in bpy.data.meshes:
        bpy.data.meshes.remove(block)
    for block in bpy.data.materials:
        bpy.data.materials.remove(block)


def mat(name, color, roughness=0.7):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    bsdf = next(n for n in m.node_tree.nodes if n.type == "BSDF_PRINCIPLED")
    bsdf.inputs["Base Color"].default_value = (*color, 1.0)
    try:
        bsdf.inputs["Roughness"].default_value = roughness
    except Exception:
        pass
    return m


def add_mesh(name, primitive, location=(0, 0, 0), scale=None, material=None, **kwargs):
    getattr(bpy.ops.mesh, f"primitive_{primitive}_add")(location=location, **kwargs)
    obj = bpy.context.active_object
    obj.name = name
    if scale:
        obj.scale = scale
        bpy.ops.object.transform_apply(scale=True)
    if material:
        obj.data.materials.append(material)
    return obj


def main():
    clear_scene()

    skin = mat("Skin", (0.94, 0.76, 0.66), 0.62)
    hair = mat("Hair", (0.08, 0.08, 0.08), 0.9)
    hoodie = mat("Hoodie", (0.16, 0.18, 0.2), 0.85)
    shirt = mat("Shirt", (0.05, 0.05, 0.06), 0.9)
    white = mat("EyeWhite", (0.96, 0.96, 0.96), 0.35)
    pupil = mat("Pupil", (0.05, 0.05, 0.05), 0.4)
    brow = mat("Brow", (0.12, 0.12, 0.12), 0.8)

    root = bpy.data.objects.new("AmilAvatar", None)
    bpy.context.collection.objects.link(root)

    body = add_mesh("Body", "uv_sphere", location=(0, 0, 0.55), scale=(0.85, 0.55, 1.0), material=hoodie)
    body.parent = root

    collar = add_mesh(
        "Collar",
        "torus",
        location=(0, 0.05, 1.25),
        material=hoodie,
        major_radius=0.42,
        minor_radius=0.12,
    )
    collar.rotation_euler[0] = 0.2
    collar.parent = root

    tee = add_mesh("Tee", "cube", location=(0, 0.12, 1.15), scale=(0.28, 0.12, 0.08), material=shirt)
    tee.parent = root

    head = add_mesh("Head", "uv_sphere", location=(0, 0, 1.95), scale=(0.78, 0.72, 0.82), material=skin)
    head.parent = root

    hair_cap = add_mesh(
        "HairCap",
        "uv_sphere",
        location=(0, -0.05, 2.25),
        scale=(0.82, 0.75, 0.55),
        material=hair,
    )
    hair_cap.parent = root

    hair_swoop = add_mesh(
        "HairSwoop",
        "uv_sphere",
        location=(-0.2, 0.2, 2.45),
        scale=(0.45, 0.28, 0.28),
        material=hair,
    )
    hair_swoop.parent = root

    for side, x in (("L", -0.72), ("R", 0.72)):
        ear = add_mesh(
            f"Ear_{side}",
            "uv_sphere",
            location=(x, 0, 1.95),
            scale=(0.12, 0.16, 0.18),
            material=skin,
        )
        ear.parent = root

    nose = add_mesh("Nose", "uv_sphere", location=(0, 0.62, 1.9), scale=(0.1, 0.1, 0.1), material=skin)
    nose.parent = root

    for side, x in (("L", -0.26), ("R", 0.26)):
        brow_obj = add_mesh(
            f"Brow_{side}",
            "cube",
            location=(x, 0.55, 2.15),
            scale=(0.12, 0.04, 0.035),
            material=brow,
        )
        brow_obj.parent = root

        eye = add_mesh(
            f"EyeWhite_{side}",
            "uv_sphere",
            location=(x, 0.58, 2.0),
            scale=(0.11, 0.08, 0.12),
            material=white,
        )
        eye.parent = root

        pupil_obj = add_mesh(
            f"Pupil_{side}",
            "uv_sphere",
            location=(x, 0.66, 2.0),
            scale=(0.055, 0.04, 0.07),
            material=pupil,
        )
        pupil_obj.parent = root

    # camera + light for quick preview
    bpy.ops.object.camera_add(location=(0, -4.2, 2.0), rotation=(1.4, 0, 0))
    cam = bpy.context.active_object
    bpy.context.scene.camera = cam
    bpy.ops.object.light_add(type="AREA", location=(2.5, -2.0, 4.0))
    light = bpy.context.active_object
    light.data.energy = 250

    out = Path(__file__).resolve().parent.parent / "public" / "amil-avatar.glb"
    out.parent.mkdir(parents=True, exist_ok=True)
    bpy.ops.export_scene.gltf(filepath=str(out), export_format="GLB", use_selection=False)
    print(f"Exported: {out}")


if __name__ == "__main__":
    main()
