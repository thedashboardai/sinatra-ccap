const fs = require('fs');

type SpecType = {
	componentName: string, replaceWith: string, importFrom: string,
	propsRegex: { match: string, replace: string }[]
}[]

class TransformComponentPlugin {

	apply(compiler) {
		compiler.hooks.emit.tapAsync('TransformComponentPlugin', (compilation, callback) => {
			const specsFile = 'transformSpecs.json';

			// Read specifications from the JSON file
			const specs = JSON.parse(fs.readFileSync(specsFile, 'utf8')) as SpecType;

			// Loop through all compiled files
			for (const filename in compilation.assets) {
				// Check if the file is a JavaScript file
				if (filename.endsWith('.js')) {
					let source = compilation.assets[filename].source();

					// Apply transformations based on specifications
					source = this.transformComponents(source, specs);

					// Write the transformed code back to the file
					fs.writeFileSync(filename, source);
				}
			}

			callback();
		});
	}

	transformComponents(source, specs: SpecType) {
		// Loop through each component specification
		for (const spec of specs) {
			// Construct import statement for transformed component
			const importStatement = `import { ${spec.replaceWith} } from '${spec.importFrom}';\n`;

			// Replace original component with transformed component
			const componentNameRegex = new RegExp(spec.componentName, 'g');
			source = source.replace(componentNameRegex, spec.replaceWith);

			// Add import statement for transformed component
			source = importStatement + source;

			// Apply props transformations
			for (const propRegex of spec.propsRegex) {
				const propMatchRegex = new RegExp(propRegex.match, 'g');
				source = source.replace(propMatchRegex, propRegex.replace);
			}
		}

		return source;
	}
}

module.exports = TransformComponentPlugin;
