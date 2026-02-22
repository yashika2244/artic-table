import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { OverlayPanel } from "primereact/overlaypanel";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useArtworkTable } from "./hooks/useArtworkTable";
import "./table.css";
export default function App() {
  const {
    data,
    rows,
    page,
    loading,
    totalRecords,
    selectedRows,
    selectedCount,
    setPage,
    onSelectionChange,
    overlayRef,
    inputCount,
    setInputCount,
    handleCustomSelect,
    validNumber,
  } = useArtworkTable();
  const renderLeft = (options: any) => {
    const start = options.totalRecords === 0 ? 0 : options.first + 1;

    const end =
      options.totalRecords === 0
        ? 0
        : Math.min(options.first + options.rows, options.totalRecords);

    return (
      <span className="custom-page-text">
        Showing <span className="num">{start}</span> to{" "}
        <span className="num">{end}</span> of{" "}
        <span className="num">{options.totalRecords}</span> entries
      </span>
    );
  };
  return (
    <div className="container">
      {/* Selected rows info */}
      <div className="selected-info">
        Selected: <span className="selected-count">{selectedCount}</span> rows
      </div>

      <DataTable
        value={data}
        size="small"
        paginator
        lazy
        rows={rows}
        totalRecords={totalRecords}
        loading={loading}
        first={(page - 1) * rows}
        onPage={(e) => setPage((e.page ?? 0) + 1)}
        selectionMode="multiple"
        selection={selectedRows}
        onSelectionChange={onSelectionChange}
        dataKey="id"
        className="assignment-table"
        scrollable
        scrollHeight="flex"
        paginatorTemplate="PrevPageLink PageLinks NextPageLink"
        paginatorLeft={renderLeft({
          first: (page - 1) * rows,
          rows,
          totalRecords,
        })}
      >
        {/* Checkbox column */}
        <Column
          selectionMode="multiple"
          headerClassName="select-header"
          style={{ width: "42px" }}
          header={
            <div className="select-header-wrapper">
              <i
                className="pi pi-chevron-down select-dropdown-icon"
                onClick={(e) => overlayRef.current?.toggle(e)}
              />

              <OverlayPanel ref={overlayRef} className="custom-overlay">
                <div className="overlay-box">
                  <div className="overlay-title">Select Multiple Rows</div>

                  <div className="overlay-sub">
                    Enter number of rows to select from current page
                  </div>

                  <div className="overlay-row">
                    <InputText
                      value={inputCount}
                      onChange={(e) => setInputCount(e.target.value)}
                      placeholder="e.g. 5"
                    />

                    <Button
                      label="Select"
                      onClick={handleCustomSelect}
                      disabled={!validNumber}
                    />
                  </div>
                </div>
              </OverlayPanel>
            </div>
          }
        />

        <Column field="title" header="TITLE" />
        <Column field="place_of_origin" header="PLACE OF ORIGIN" />
        <Column field="artist_display" header="ARTIST" />
        <Column
          header="INSCRIPTIONS"
          body={(row) => row.inscriptions || "N/A"}
        />
        <Column field="date_start" header="START DATE" />
        <Column field="date_end" header="END DATE" />
      </DataTable>
    </div>
  );
}
