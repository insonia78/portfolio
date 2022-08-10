#!/bin/bash

if [ ${#} -lt 2 ]; then
    echo "Usage: ./build_system_level_tool_view_debian_package.sh <SVN Server> <version> [branch name]"
    exit 0
fi

branch=trunk

if [ ! -z ${3} ]
then
    if [ ${3} == "release" ]
    then
	branch=release/${2}
    else
	branch=branches/${3}
    fi
fi

build_dir=system-level-tool-view-${2}

rm -rf system_level_tool_view_package
mkdir system_level_tool_view_package
cd system_level_tool_view_package
svn co https://${1}/svn/SystemLevelToolView/$branch ${build_dir}
tar czf ${build_dir}.tar.gz ${build_dir}
cd ${build_dir}
dh_make -y -s -f ../${build_dir}.tar.gz
cp ../../system_level_tool_view_postinst debian/postinst
dpkg-buildpackage -us -uc
cd ../
debian_package=system-level-tool-view_${2}-1_amd64.deb
cp ${debian_package} ../.
cd ../
rm -rf system_level_tool_view_package

sed -i -- "s/DEBIAN_PACKAGE/${debian_package}/g" install_system_level_tool_view.sh
