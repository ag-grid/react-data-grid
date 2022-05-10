cat pdf-metadata.md > react-tutorial.md
cat newpage.md >> react-tutorial.md
cat 00a-introduction.md >> react-tutorial.md
cat newpage.md >> react-tutorial.md
cat 001-quickstart-react-ag-grid.md >> react-tutorial.md
cat newpage.md >> react-tutorial.md
cat 002-enterprise-overview.md >> react-tutorial.md
cat newpage.md >> react-tutorial.md
cat 003-customising-cells.md >> react-tutorial.md
cat newpage.md >> react-tutorial.md
cat 004-react-rendering.md >> react-tutorial.md
cat newpage.md >> react-tutorial.md
cat 005-react-filters.md >> react-tutorial.md
cat newpage.md >> react-tutorial.md
cat 006-react-custom-filters.md >> react-tutorial.md
cat newpage.md >> react-tutorial.md
cat 007-react-custom-floating-filters.md >> react-tutorial.md
cat newpage.md >> react-tutorial.md
cat 008-react-components.md >> react-tutorial.md
cat newpage.md >> react-tutorial.md
cat 009-updating-row-data.md >> react-tutorial.md
cat newpage.md >> react-tutorial.md
cat 010-react-columns.md >> react-tutorial.md
cat newpage.md >> react-tutorial.md
cat 999-outro.md >> react-tutorial.md
pandoc react-tutorial.md -o react-tutorial-workbook.pdf --from markdown --template eisvogel --listings --toc
open react-tutorial-workbook.pdf