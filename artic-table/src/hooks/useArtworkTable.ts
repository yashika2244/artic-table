import { useEffect, useRef, useState } from "react";
import { OverlayPanel } from "primereact/overlaypanel";
import { fetchArtworks } from "../api";
import type { Artwork } from "../types";

export function useArtworkTable() {
    const [data, setData] = useState<Artwork[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
    const [inputCount, setInputCount] = useState("");

    const rows = 12;
    const overlayRef = useRef<OverlayPanel>(null);

    // load data when page changes
    useEffect(() => {
        const fetchPage = async () => {
            setLoading(true);
            try {
                const res = await fetchArtworks(page);
                setData(res.data);
                setTotalRecords(res.pagination.total);
            } catch (err) {
                console.error("error loading data", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPage();
    }, [page]);

    // handle checkbox select/deselect
    const onSelectionChange = (e: any) => {
        const updated = new Set(selectedIds);

        // add selected
        e.value.forEach((row: Artwork) => {
            updated.add(row.id);
        });

        // remove unselected from current page
        data.forEach((row) => {
            const stillSelected = e.value.some((r: Artwork) => r.id === row.id);
            if (!stillSelected) updated.delete(row.id);
        });

        setSelectedIds(updated);
    };

    // select first N rows from current page only
    const handleCustomSelect = () => {
        const count = parseInt(inputCount);
        if (!count || count <= 0) return;

        const updated = new Set(selectedIds);

        data.slice(0, count).forEach((row) => {
            updated.add(row.id);
        });

        setSelectedIds(updated);
        overlayRef.current?.hide();
        setInputCount("");
    };

    // rows selected on this page
    const selectedRows = data.filter((row) => selectedIds.has(row.id));

    const validNumber = inputCount.trim() !== "" && Number(inputCount) > 0;

    return {
        data,
        loading,
        page,
        setPage,
        totalRecords,
        selectedRows,
        onSelectionChange,
        overlayRef,
        inputCount,
        setInputCount,
        handleCustomSelect,
        validNumber,
        rows,
        selectedCount: selectedIds.size,
    };
}