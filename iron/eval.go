package main

import (
	"encoding/json"
	"fmt"
	"os"
)

type Individual struct {
	Chromosome string
}

func main() {
	p := &Individual{Chromosome: ""}
	json.NewDecoder(os.Stdin).Decode(p)
	fmt.Printf("Decoded %Chromosome!", p.Chromosome)
}
