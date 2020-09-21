import setuptools

version = {}
with open("./version.py") as fp:
    exec(fp.read(), version)

setuptools.setup(
    name="NorthEastPipeline",
    version=version['__version__'],
    install_requires=[],
    packages=setuptools.find_packages()
)
