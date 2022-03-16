cat newpage.md > react-tutorial.md
cat 001-quickstart-react-ag-grid.md >> react-tutorial.md
# cat 010-introduction.md >> react-tutorial.md
cat newpage.md >> react-tutorial.md
cat 002-enterprise-overview.md >> react-tutorial.md
cat newpage.md >> react-tutorial.md
#cat 030-column-properties.md >> react-tutorial.md
pandoc react-tutorial.md -o react-tutorial-workbook.pdf --from markdown --template eisvogel --listings --toc
open react-tutorial-workbook.pdf