import setuptools

version = {}
with open("./version.py") as fp:
    exec(fp.read(), version)


setuptools.setup(
    name="MidAtlanticPipeline",
    version=version,
    install_requires=[],
    packages=setuptools.find_packages()
)
