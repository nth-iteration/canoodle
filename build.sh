out="./out/canoodle"

function clean {
	echo "Cleaning..."
	rm -rf $out
}

function compile {
	copy-static
	compile-ts
	compile-sass
}

function copy-static {
	echo "Copying static files..."

	mkdir -p $out

	#cp -r ./static/* $out/
}

function compile-ts {
	echo "Compiling TypeScript files..."

	# Library files
	for file in ./ts/*.ts
	do
		echo "$file"
		tsc --comments --out $out/js $file || exit -1
	done

	# Devices files
	for file in ./ts/devices/*.ts
	do
		echo "$file"
		tsc --comments --out $out/js/devices $file || exit -1
	done
}

function compile-sass {
	echo "Compiling Sass files..."
	mkdir -p $out/css/
	sass ./scss/1080.scss $out/css/1080.css
	sass ./scss/720.scss $out/css/720.css
	sass ./scss/540.scss $out/css/540.css
}

function optomise {
	echo "Optomising using Google Closure..." 

	# Read the js file
	for file in $out/js/*.js
	do
		echo "$file"
		js=$(<$file)
		google-closure
	done
	
	# Read the js file
	for file in $out/js/devices/*.js
	do
		echo "$file"
		js=$(<$file)
		google-closure
	done
}

function google-closure {
	# Google Closure Compiler API
	url="http://closure-compiler.appspot.com/compile"
	# WHITESPACE_ONLY, SIMPLE_OPTIMIZATIONS, ADVANCED_OPTIMIZATIONS
	level="SIMPLE_OPTIMIZATIONS"
	# text, json, xml
	format="text"
	# compiled_code, warnings, errors, statistics
	info="compiled_code"
	# compile using remote API
	code=$(curl --data-urlencode "js_code=$js" --data "compilation_level=$level&output_format=$format&output_info=$info" $url)
	# Write out
	echo "$code" > $file
}

function copyright {
	echo "Adding copyright license."
	cp banner.txt $out/COPYRIGHT.txt
	cat MIT_license.txt >> $out/COPYRIGHT.txt
}

if [ "$1" = "--clean" ] || [ "$1" = "-c" ]; then
	cat banner.txt
	clean
	echo "Project cleaned."
	exit
elif [ "$1" = "--dev" ] || [ "$1" = "-d" ]; then
	cat banner.txt
	clean
	compile
	copyright
	echo "Development build complete."
	exit
elif [ -z "$1" ]; then
	cat banner.txt
	clean
	compile
	optomise
	copyright
	echo "Release build complete."
	exit
fi

echo "Argument not recognised: $1"
exit