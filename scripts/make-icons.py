"""Generate exact, dependency-free PNG app icons from the geometric brand mark."""
from pathlib import Path
import struct, zlib
root = Path(__file__).resolve().parents[1] / "public"
def chunk(kind, value):
    return struct.pack(">I",len(value))+kind+value+struct.pack(">I",zlib.crc32(kind+value)&0xffffffff)
for size in (192,512):
    rows=[]
    for y in range(size):
        row=bytearray()
        for x in range(size):
            a,b=x*64/size,y*64/size
            white=((16<=a<28 and 16<=b<28) or (36<=a<48 and 16<=b<28) or (16<=a<28 and 36<=b<48) or (40<=a<45 and 34<=b<50) or (34<=a<50 and 40<=b<45))
            row.extend((255,255,255,255) if white else (79,70,229,255))
        rows.append(b"\0"+row)
    data=b"\x89PNG\r\n\x1a\n"+chunk(b"IHDR",struct.pack(">IIBBBBB",size,size,8,6,0,0,0))+chunk(b"IDAT",zlib.compress(b"".join(rows),9))+chunk(b"IEND",b"")
    (root/("icon-"+str(size)+".png")).write_bytes(data)
